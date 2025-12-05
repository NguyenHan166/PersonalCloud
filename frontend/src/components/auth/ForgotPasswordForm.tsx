import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/common';
import { useAuthStore } from '@/stores';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const sendForgotPasswordOtp = useAuthStore((state) => state.sendForgotPasswordOtp);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendForgotPasswordOtp(data.email);
      if (result.success) {
        navigate('/auth/verify-otp');
      } else {
        setError(result.error || 'Gửi mã xác thực thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Back button */}
      <Link
        to="/auth/login"
        className="flex items-center gap-2 text-muted hover:text-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Quay lại đăng nhập</span>
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text">Quên mật khẩu?</h1>
        <p className="text-muted mt-2">
          Nhập email của bạn, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">
            Email
          </label>
          <Input
            type="email"
            placeholder="email@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Đang gửi...
            </>
          ) : (
            'Gửi mã xác thực'
          )}
        </Button>
      </form>

      {/* Register link */}
      <p className="mt-6 text-center text-sm text-muted">
        Nhớ mật khẩu rồi?{' '}
        <Link to="/auth/login" className="text-primary font-medium hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};
