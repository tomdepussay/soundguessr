interface FormProps {
    children: React.ReactNode;
}

function Form({ children }: FormProps){
    return (
        <div className="w-full h-fit grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {children}
        </div>
    )
}

export default Form;