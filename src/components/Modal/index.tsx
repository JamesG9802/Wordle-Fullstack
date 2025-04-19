import { GenericComponentProps } from "components";
import { Dispatch, SetStateAction } from "react";

export type ModalProps = GenericComponentProps &
{
    /**
     * Whether the modal is visible or not.
     */
    visible: boolean
    set_visible: Dispatch<SetStateAction<boolean>>
};

/**
 * A modal component.
 * @returns 
 */
export function Modal({ children, visible, set_visible }: ModalProps): JSX.Element {
    return (
        <>
            {
                visible &&
                <div className="absolute top-0 left-0 w-screen h-screen bg-onbackground/10"
                    onClick={() => {
                        set_visible(false);
                    }}
                >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-surfacecontainer p-4 m-4 rounded-md shadow-md">
                        {children}
                    </div>
                </div >
            }
        </>
    );
}

export default Modal;