import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common';
import { useAuthStore } from '@/stores';

export const VerifyOtpForm: React.FC = () => {
  const navigate = useNavigate();
  const { pendingVerification, verifyOtp, resendOtp, clearPendingVerification } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no pending verification
  useEffect(() => {
    if (!pendingVerification) {
      navigate('/auth/login');
    }
  }, [pendingVerification, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Vui lòng nhập đủ 6 số');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyOtp(otpString);
      if (result.success) {
        if (pendingVerification?.type === 'register') {
          navigate('/app/library');
        } else {
          navigate('/auth/reset-password');
        }
      } else {
        setError(result.error || 'Xác thực thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(60);
    await resendOtp();
  };

  const handleBack = () => {
    clearPendingVerification();
    navigate('/auth/login');
  };

  if (!pendingVerification) return null;

  return (
    <div>
      {/* Back button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-muted hover:text-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Quay lại</span>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-text">Xác thực Email</h1>
        <p className="text-muted mt-2">
          Chúng tôi đã gửi mã OTP đến<br />
          <span className="font-medium text-text">{pendingVerification.email}</span>
        </p>
      </div>

      {/* Mock OTP hint */}
      <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm text-center">
        🔑 Mã OTP test: <span className="font-mono font-bold">123456</span>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-xl font-semibold border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
            />
          ))}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || otp.join('').length !== 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Đang xác thực...
            </>
          ) : (
            'Xác nhận'
          )}
        </Button>
      </form>

      {/* Resend */}
      <p className="mt-6 text-center text-sm text-muted">
        Không nhận được mã?{' '}
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-primary font-medium hover:underline"
          >
            Gửi lại
          </button>
        ) : (
          <span>Gửi lại sau {countdown}s</span>
        )}
      </p>
    </div>
  );
};
