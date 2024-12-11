// frontend/src/pages/client/MessagesPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';

const MessagesPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // TODO: Implement message fetching logic
        setMessages([]);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        {messages.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No messages yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {messages.map(message => (
              <div key={message.id} className="bg-white shadow rounded-lg p-6">
                <p>Message details will go here</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;