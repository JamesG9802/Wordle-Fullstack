import { GenericComponentProps } from "../../components";

export function Page({className, children, ...props}: GenericComponentProps): JSX.Element {
  return (
    <div 
      className={`p-0 mx-0 my-0 
      min-h-screen 
      scroll-smooth font-sans
      ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default Page;