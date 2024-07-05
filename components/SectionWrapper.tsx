const SectionWrapper = ({ children, ...props }: Record<string ,any>) => (
    <section {...props} className={`py-16 ${props.className || ""}`}>
        {children}
    </section>
)

export default SectionWrapper