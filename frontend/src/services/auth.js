import { auth } from '../config/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const authService = {
  async register({ email, password, role, fullName }) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // Register user in backend
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          role,
          fullName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', token);

      return data;
    } catch (error) {
      // If backend registration fails, delete the Firebase user
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
      throw error;
    }
  },

  async login({ email, password }) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', token);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  },

  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user data');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
};

export default authService;
