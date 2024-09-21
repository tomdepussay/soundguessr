interface FormRowProps {
    center?: boolean;
    children: React.ReactNode;
}

function FormRow({ center, children }: FormRowProps) {
    return (
        <div className={`w-full mt-5 flex gap-10 items-center ${center && "justify-center"}`}>
            {children}
        </div>
    )
}

export default FormRow;