import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Account {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
}

interface PendingVerification {
  email: string;
  type: 'register' | 'forgot-password';
  userData?: {
    name: string;
    password: string;
  };
}

interface AuthState {
  user: User | null;
  account: Account | null;
  isAuthenticated: boolean;
  pendingVerification: PendingVerification | null;
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; error?: string }>;
  sendForgotPasswordOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resendOtp: () => Promise<{ success: boolean; error?: string }>;
  clearPendingVerification: () => void;
}

// Mock registered users (persisted separately)
const MOCK_USERS_KEY = 'cloudhan_users';

const getStoredUsers = (): Record<string, { name: string; password: string }> => {
  try {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    return stored ? JSON.parse(stored) : {
      // Default account
      'nvhan166@gmail.com': { name: 'Nguyen Han', password: 'han1662003' }
    };
  } catch {
    return { 'nvhan166@gmail.com': { name: 'Nguyen Han', password: 'han1662003' } };
  }
};

const saveUser = (email: string, name: string, password: string) => {
  const users = getStoredUsers();
  users[email] = { name, password };
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

// Mock OTP (in real app, this would be sent via email)
const MOCK_OTP = '123456';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      account: null,
      isAuthenticated: false,
      pendingVerification: null,

      login: async (email: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getStoredUsers();
        const user = users[email];

        if (!user) {
          return { success: false, error: 'Email không tồn tại' };
        }

        if (user.password !== password) {
          return { success: false, error: 'Mật khẩu không đúng' };
        }

        set({
          user: {
            id: `user_${Date.now()}`,
            email,
            name: user.name,
          },
          account: {
            id: 'acc_1',
            name: 'Personal Workspace',
            plan: 'free',
          },
          isAuthenticated: true,
        });

        return { success: true };
      },

      logout: () => {
        set({
          user: null,
          account: null,
          isAuthenticated: false,
          pendingVerification: null,
        });
      },

      register: async (name: string, email: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getStoredUsers();
        if (users[email]) {
          return { success: false, error: 'Email đã được sử dụng' };
        }

        // Store pending verification
        set({
          pendingVerification: {
            email,
            type: 'register',
            userData: { name, password },
          },
        });

        // In real app: send OTP to email
        console.log(`📧 OTP sent to ${email}: ${MOCK_OTP}`);

        return { success: true };
      },

      verifyOtp: async (otp: string) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        if (otp !== MOCK_OTP) {
          return { success: false, error: 'Mã OTP không đúng' };
        }

        const { pendingVerification } = get();
        if (!pendingVerification) {
          return { success: false, error: 'Không có yêu cầu xác thực' };
        }

        if (pendingVerification.type === 'register' && pendingVerification.userData) {
          // Complete registration
          const { email, userData } = pendingVerification;
          saveUser(email, userData.name, userData.password);

          // Auto login
          set({
            user: {
              id: `user_${Date.now()}`,
              email,
              name: userData.name,
            },
            account: {
              id: 'acc_1',
              name: 'Personal Workspace',
              plan: 'free',
            },
            isAuthenticated: true,
            pendingVerification: null,
          });
        }

        return { success: true };
      },

      sendForgotPasswordOtp: async (email: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getStoredUsers();
        if (!users[email]) {
          return { success: false, error: 'Email không tồn tại trong hệ thống' };
        }

        set({
          pendingVerification: {
            email,
            type: 'forgot-password',
          },
        });

        console.log(`📧 Password reset OTP sent to ${email}: ${MOCK_OTP}`);

        return { success: true };
      },

      resetPassword: async (newPassword: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const { pendingVerification } = get();
        if (!pendingVerification || pendingVerification.type !== 'forgot-password') {
          return { success: false, error: 'Phiên xác thực không hợp lệ' };
        }

        const users = getStoredUsers();
        const email = pendingVerification.email;
        const existingUser = users[email];

        if (!existingUser) {
          return { success: false, error: 'Không tìm thấy tài khoản' };
        }

        // Update password
        saveUser(email, existingUser.name, newPassword);

        set({ pendingVerification: null });

        return { success: true };
      },

      resendOtp: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const { pendingVerification } = get();
        if (!pendingVerification) {
          return { success: false, error: 'Không có yêu cầu xác thực' };
        }

        console.log(`📧 OTP resent to ${pendingVerification.email}: ${MOCK_OTP}`);
        return { success: true };
      },

      clearPendingVerification: () => {
        set({ pendingVerification: null });
      },
    }),
    {
      name: 'cloudhan-auth',
      partialize: (state) => ({
        user: state.user,
        account: state.account,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
