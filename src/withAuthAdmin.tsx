import { useEffect } from "react";
import { useRouter } from "next/router";

const withAuthAdmin = (WrappedComponent: React.ComponentType) => {
  const WithAuthAdmin = (props: JSX.IntrinsicAttributes) => {
    const router = useRouter();

    useEffect(() => {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        router.push("/login/admin");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  WithAuthAdmin.displayName = `WithAuthAdmin(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithAuthAdmin;
};

export default withAuthAdmin;
