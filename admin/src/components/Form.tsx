interface FormProps {
    children: React.ReactNode;
}

function Form({ children }: FormProps){
    return (
        <div className="w-full h-fit">
            {children}
        </div>
    )
}

export default Form;