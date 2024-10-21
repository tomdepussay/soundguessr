    interface FormProps {
    action?: string;
    children: React.ReactNode;
    onSubmit?: () => void;
}

function Form({ action, children, onSubmit }: FormProps){

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit && onSubmit()
    }

    return (
        <form className='w-full p-2 flex flex-row flex-wrap' action={action} onSubmit={handleSubmit}>
            {children}
        </form>
    )
}

export default Form;