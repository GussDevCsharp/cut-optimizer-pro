
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormValues } from "./useLeadManagement";

export const useUserForm = () => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  return form;
};
