
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Lock, UserPlus, LogIn } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    onOpenChange(false);
    navigate('/signup');
  };

  const handleSignIn = () => {
    onOpenChange(false);
    navigate('/login');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center">Authentication Required</DialogTitle>
          <DialogDescription className="text-center">
            Please sign in or create an account to access greenwashing analysis features and upload reports.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 mt-6">
          <Button onClick={handleSignUp} className="w-full bg-green-600 hover:bg-green-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Create Account
          </Button>
          <Button onClick={handleSignIn} variant="outline" className="w-full">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
