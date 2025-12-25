import { logout } from "../auth/authStorage";

export default function LogoutButton() {
    return (
        <button
            onClick={() => {
                logout();
                window.location.href = "/user/login";
            }}
        >
            Logout
        </button>
    );
}
