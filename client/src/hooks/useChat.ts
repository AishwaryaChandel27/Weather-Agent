import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Message, Conversation, ChatState } from "@/types/chat";
import { apiRequest } from "@/lib/queryClient";
import { useWeatherAgent } from "./useWeatherAgent";

export function useChat() {
  const queryClient = useQueryClient();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Get current conversation
  const currentConversation = currentConversationId 
    ? queryClient.getQueryData<Conversation>(['conversations', currentConversationId])
    : null;

  const weatherAgent = useWeatherAgent({
    threadId: currentConversation?.threadId || 'default-thread'
  });

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations'],
  });

  // Fetch messages for current conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/conversations', currentConversationId, 'messages'],
    enabled: !!currentConversationId,
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (data: { title: string; threadId: string }) => {
      const response = await apiRequest('POST', '/api/conversations', data);
      return response.json();
    },
    onSuccess: (newConversation) => {
      queryClient.setQueryData(['/api/conversations'], (old: Conversation[] = []) => [
        newConversation,
        ...old,
      ]);
      setCurrentConversationId(newConversation.id);
    },
  });

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: async (data: { conversationId: string; role: string; content: string; metadata?: any }) => {
      const response = await apiRequest('POST', `/api/conversations/${data.conversationId}/messages`, data);
      return response.json();
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(
        ['/api/conversations', newMessage.conversationId, 'messages'],
        (old: Message[] = []) => [...old, newMessage]
      );
    },
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      await apiRequest('DELETE', `/api/conversations/${conversationId}`);
    },
    onSuccess: (_, conversationId) => {
      queryClient.setQueryData(['/api/conversations'], (old: Conversation[] = []) =>
        old.filter(conv => conv.id !== conversationId)
      );
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    },
  });

  // Send message function
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    let conversationId = currentConversationId;

    // Create new conversation if none exists
    if (!conversationId) {
      const threadId = `thread-${Date.now()}`;
      const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
      
      const newConversation = await createConversationMutation.mutateAsync({
        title,
        threadId,
      });
      
      conversationId = newConversation.id;
    }

    // Add user message
    await createMessageMutation.mutateAsync({
      conversationId,
      role: 'user',
      content,
    });

    // Prepare messages for API
    const allMessages = [
      ...messages,
      { role: 'user', content }
    ];

    // Start streaming response
    setIsStreaming(true);
    setStreamingMessage("");

    await weatherAgent.sendMessage(
      allMessages,
      (chunk: string) => {
        setStreamingMessage(prev => prev + chunk);
      },
      async (fullResponse: string) => {
        setIsStreaming(false);
        setStreamingMessage("");

        // Save assistant response
        await createMessageMutation.mutateAsync({
          conversationId: conversationId!,
          role: 'assistant',
          content: fullResponse,
          metadata: {
            timestamp: new Date().toISOString(),
          },
        });
      }
    );
  }, [currentConversationId, messages, createConversationMutation, createMessageMutation, weatherAgent]);

  // Create new conversation
  const newConversation = useCallback(() => {
    setCurrentConversationId(null);
  }, []);

  // Delete conversation
  const deleteConversation = useCallback((conversationId: string) => {
    deleteConversationMutation.mutate(conversationId);
  }, [deleteConversationMutation]);

  // Clear chat history
  const clearHistory = useCallback(async () => {
    for (const conversation of conversations) {
      await deleteConversationMutation.mutateAsync(conversation.id);
    }
  }, [conversations, deleteConversationMutation]);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!currentConversationId && conversations.length > 0) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [currentConversationId, conversations]);

  return {
    // State
    conversations,
    messages,
    currentConversation,
    isLoading: conversationsLoading || messagesLoading,
    isStreaming: isStreaming || weatherAgent.isStreaming,
    streamingMessage,
    error: weatherAgent.error,

    // Actions
    sendMessage,
    newConversation,
    deleteConversation,
    clearHistory,
    setCurrentConversationId,
  };
}
