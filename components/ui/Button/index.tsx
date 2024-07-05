const Button = ({ children, ...props }: Record<string, any>) => (
    <button
        role="button"
        {...props}
        className={`${props.className || ""} px-4 py-2 rounded-lg duration-150`}
    >
        {children}
    </button>
)
export default Button