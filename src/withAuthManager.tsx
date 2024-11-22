import { useEffect } from "react";
import { useRouter } from "next/router";

const WithAuthManager = (WrappedComponent: React.ComponentType) => {
  const WithAuthManager = (props: JSX.IntrinsicAttributes) => {
    const router = useRouter();

    useEffect(() => {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        router.push("/login/manager");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  WithAuthManager.displayName = `withAuthManager(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithAuthManager;
};

export default WithAuthManager;
