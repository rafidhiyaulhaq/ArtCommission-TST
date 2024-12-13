// frontend/src/pages/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterPage = () => {
 const navigate = useNavigate();
 const [formData, setFormData] = useState({
   email: '',
   password: '',
   confirmPassword: '',
   role: 'client',
   fullName: ''
 });
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 const handleChange = (e) => {
   const { name, value } = e.target;
   setFormData(prev => ({
     ...prev,
     [name]: value
   }));
 };

 const handleSubmit = async (e) => {
   e.preventDefault();
   setError('');
   console.log('Starting registration process...');

   if (formData.password !== formData.confirmPassword) {
     setError('Passwords do not match');
     return;
   }

   setLoading(true);

   try {
     console.log('Attempting Firebase registration for:', formData.email);
     
     const userCredential = await createUserWithEmailAndPassword(
       auth,
       formData.email,
       formData.password
     );

     console.log('Firebase registration successful, getting token...');
     const token = await userCredential.user.getIdToken();

     console.log('Sending data to backend...');
     const response = await fetch('https://artcommission-tst-production.up.railway.app/auth/register', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
       },
       body: JSON.stringify({
         uid: userCredential.user.uid,
         email: formData.email,
         role: formData.role,
         fullName: formData.fullName
       })
     });

     console.log('Backend response status:', response.status);

     if (!response.ok) {
       const errorData = await response.json().catch(() => ({}));
       console.error('Backend error response:', errorData);
       
       if (auth.currentUser) {
         await auth.currentUser.delete();
       }
       
       throw new Error(errorData.error || `Backend error: ${response.status}`);
     }

     const data = await response.json();
     console.log('Registration successful:', data);
     
     localStorage.setItem('token', token);
     navigate('/dashboard');
   } catch (error) {
     console.error('Detailed registration error:', {
       code: error.code,
       message: error.message,
       fullError: error
     });

     if (error.code === 'auth/email-already-in-use') {
       setError('This email is already registered. Please use a different email or sign in.');
     } else if (error.code === 'auth/invalid-email') {
       setError('Invalid email address. Please check your email.');
     } else if (error.code === 'auth/weak-password') {
       setError('Password must be at least 6 characters.');
     } else if (error.message.includes('Backend error: 500')) {
       setError('Server error. Please try again later.');
     } else if (error.message.includes('Backend error: 404')) {
       setError('Registration service is currently unavailable.');
     } else {
       setError('Failed to complete registration. Please try again.');
     }

     if (auth.currentUser) {
       try {
         await auth.currentUser.delete();
         console.log('Cleaned up Firebase user due to registration failure');
       } catch (deleteError) {
         console.error('Error cleaning up Firebase user:', deleteError);
       }
     }
   } finally {
     console.log('Registration process completed');
     setLoading(false);
   }
 };

 return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
     <div className="max-w-md w-full space-y-8">
       <div>
         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
           Create your account
         </h2>
       </div>
       
       {error && (
         <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
           {error}
         </div>
       )}

       <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
         <div className="rounded-md shadow-sm -space-y-px">
           <div>
             <label htmlFor="fullName" className="sr-only">Full Name</label>
             <input
               id="fullName"
               name="fullName"
               type="text"
               required
               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
               placeholder="Full Name"
               value={formData.fullName}
               onChange={handleChange}
             />
           </div>
           <div>
             <label htmlFor="email" className="sr-only">Email address</label>
             <input
               id="email"
               name="email"
               type="email"
               required
               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
               placeholder="Email address"
               value={formData.email}
               onChange={handleChange}
             />
           </div>
           <div>
             <label htmlFor="password" className="sr-only">Password</label>
             <input
               id="password"
               name="password"
               type="password"
               required
               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
               placeholder="Password"
               value={formData.password}
               onChange={handleChange}
             />
           </div>
           <div>
             <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
             <input
               id="confirmPassword"
               name="confirmPassword"
               type="password"
               required
               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
               placeholder="Confirm Password"
               value={formData.confirmPassword}
               onChange={handleChange}
             />
           </div>
           <div>
             <label htmlFor="role" className="sr-only">Role</label>
             <select
               id="role"
               name="role"
               required
               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
               value={formData.role}
               onChange={handleChange}
             >
               <option value="client">Client</option>
               <option value="artist">Artist</option>
             </select>
           </div>
         </div>

         <div>
           <button
             type="submit"
             disabled={loading}
             className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
           >
             {loading ? 'Creating account...' : 'Create account'}
           </button>
         </div>

         <div className="text-sm text-center">
           <Link 
             to="/login" 
             className="font-medium text-indigo-600 hover:text-indigo-500"
           >
             Already have an account? Sign in
           </Link>
         </div>
       </form>
     </div>
   </div>
 );
};

export default RegisterPage;