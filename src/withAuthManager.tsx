import { useEffect } from "react";
import { useRouter } from "next/router";

const withAuthManager = (WrappedComponent: React.ComponentType) => {
  const withAuthManager = (props: JSX.IntrinsicAttributes) => {
    const router = useRouter();

    useEffect(() => {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        router.push("/login/manager");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  withAuthManager.displayName = `withAuthManager(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return withAuthManager;
};

export default withAuthManager;
