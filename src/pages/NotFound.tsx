
import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-levelup-primary mb-4">404</h1>
        <p className="text-xl text-foreground mb-2">Página não encontrada</p>
        <p className="text-muted-foreground mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-levelup-primary text-white rounded-full font-medium hover:bg-levelup-dark transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
