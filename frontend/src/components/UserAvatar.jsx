const getInitial = (username) => {
    if (!username) {
        return '?';
    }

    return username.trim().charAt(0).toUpperCase() || '?';
};

const UserAvatar = ({ username, className = '', textClassName = '' }) => {
    return (
        <div
            className={`flex items-center justify-center rounded-full bg-[#5865f2] font-semibold text-white ${className}`.trim()}
            aria-label={`${username || 'Unknown user'} avatar`}
        >
            <span className={textClassName}>{getInitial(username)}</span>
        </div>
    );
};

export default UserAvatar;
