"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/features/authSlice";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const response = await authApi.login(values);
      const session = {
        accessToken: response.data.accessToken,
        user: response.data.user,
      };

      localStorage.setItem("lms_auth", JSON.stringify(session));
      dispatch(setSession(session));

      const next = params.get("next") || "/";
      router.push(next);
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />

      {errors.root?.message ? <p className="text-sm text-red-600">{errors.root.message}</p> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
