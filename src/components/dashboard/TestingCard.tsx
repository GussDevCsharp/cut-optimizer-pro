
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";

export const TestingCard = () => {
  return (
    <Card className="overflow-hidden border transition-all bg-background hover:border-primary/50 hover:shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center h-[160px]">
          <div className="rounded-full p-3 bg-primary/10">
            <ClipboardCheck className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Rotina de Testes</h3>
            <p className="text-sm text-muted-foreground">
              Verificação de funcionalidades
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-center">
        <Link to="/testing">
          <Button variant="outline" className="w-full">
            Acessar Testes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TestingCard;
