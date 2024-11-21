// frontend/src/pages/artist/PortfolioPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PortfolioPage = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'digital-art',
    price: '',
    image: null
  });

  useEffect(() => {
    fetchPortfolios();
  }, [user]);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch(`http://localhost:8000/portfolio/${user.uid}`);
      const data = await response.json();
      setPortfolios(data.portfolios);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  };

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `portfolio/${user.uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (formData.image) {
        imageUrl = await handleImageUpload(formData.image);
      }

      const response = await fetch('http://localhost:8000/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          ...formData,
          imageUrl
        })
      });

      if (!response.ok) throw new Error('Failed to create portfolio');

      setFormData({
        title: '',
        description: '',
        category: 'digital-art',
        price: '',
        image: null
      });

      fetchPortfolios();
    } catch (error) {
      console.error('Error creating portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Add Portfolio Form */}
        <div className="bg-white shadow sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Add New Portfolio Item
            </h3>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="digital-art">Digital Art</option>
                  <option value="illustration">Illustration</option>
                  <option value="character-design">Character Design</option>
                  <option value="concept-art">Concept Art</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                  className="mt-1 block w-full"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Adding...' : 'Add Portfolio Item'}
              </button>
            </form>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((item) => (
            <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
              {item.imageUrl && (
                <div className="w-full h-48">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {item.category}
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    ${item.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PortfolioPage;