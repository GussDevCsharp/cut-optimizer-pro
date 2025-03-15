
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';

type HeaderAvatarProps = {
  className?: string;
};

export const HeaderAvatar = ({ className }: HeaderAvatarProps) => {
  const { user } = useAuth();
  
  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-primary text-primary-foreground">
        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
      </AvatarFallback>
    </Avatar>
  );
};
