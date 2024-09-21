interface FormProps {
    action?: string;
    children: React.ReactNode;
}

function Form({ action, children }: FormProps){

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("submit")
        e.preventDefault();
    }

    return (
        <form className='w-full p-2 flex flex-row flex-wrap' action={action} onSubmit={handleSubmit}>
            {children}
        </form>
    )
}

export default Form;