import { useEffect } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        router.push("/login/admin"); // or somewhere else
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;