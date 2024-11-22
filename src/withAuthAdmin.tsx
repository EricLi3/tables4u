import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const instance = axios.create({
  baseURL: "https://jz4oihez68.execute-api.us-east-2.amazonaws.com/initial",
});

const withAuthAdmin = (WrappedComponent: React.ComponentType) => {
  const WithAuthAdmin = (props: JSX.IntrinsicAttributes) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        router.push("/login/admin");
      }
      
      const verifyToken = async () => {
        try {
          const response = await instance.post("/validateToken", { token: sessionStorage.getItem("jwtToken") });
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            router.push("/login/admin");
          }
        } catch (error) {
          router.push("/login/admin");
        }
      };

      verifyToken();
    }, [router]);

    if (!isAuthenticated) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthAdmin.displayName = `WithAuthAdmin(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithAuthAdmin;
};

export default withAuthAdmin;
