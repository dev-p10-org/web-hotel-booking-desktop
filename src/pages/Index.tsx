
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">Your new React application</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Hello World
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" className="mt-4">
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
