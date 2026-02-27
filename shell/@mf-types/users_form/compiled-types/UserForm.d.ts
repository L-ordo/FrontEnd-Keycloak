import "./index.css";
type Props = {
    token: string;
    api: {
        createUser: (token: string, payload: any) => Promise<void>;
    };
    onChanged?: () => void;
};
export default function UserForm({ token, api, onChanged }: Props): import("react/jsx-runtime").JSX.Element;
export {};
