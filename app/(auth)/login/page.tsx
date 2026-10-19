import { requireUnauth } from "@/lib/auth-utils";
import { LoginForm } from "@/modules/auth/components/login-form";

const Page = async () => {
    await requireUnauth();

    return <LoginForm />;
};

export default Page;
