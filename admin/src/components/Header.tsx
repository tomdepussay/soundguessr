export default function Header({
    children
}: {
    children: React.ReactNode;
}){
    return (
        <div className="p-4 border-b">
            {children}
        </div>
    )
}