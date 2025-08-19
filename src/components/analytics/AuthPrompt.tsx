
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock } from 'lucide-react';

interface AuthPromptProps {
  title: string;
  description: string;
  onShowAuthDialog: () => void;
}

const AuthPrompt: React.FC<AuthPromptProps> = ({ title, description, onShowAuthDialog }) => (
  <Card className="text-center py-12 border-2 border-dashed border-gray-300">
    <CardContent>
      <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      <div className="space-y-3">
        <Button onClick={onShowAuthDialog} className="bg-green-600 hover:bg-green-700">
          <Lock className="w-4 h-4 mr-2" />
          Sign In to View Analytics
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default AuthPrompt;
