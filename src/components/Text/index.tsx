import { GenericComponentProps } from "components";

export type TextProps = {
    /**
     * The type of text which affects the styling. Defaults to normal if no type is specified.
     */
    type?: "normal" | "title" | "h1" | "h2" | "h3" | "h4" | "h5"
  
    text?: string
  
    id?: string
  } & GenericComponentProps;
  
  /**
   * Generic component for text.
   * @param props for Text
   * @returns 
   */
  export function Text({ type, className, style, text, children, id }: TextProps) {
    let Tag: keyof JSX.IntrinsicElements;
    let class_styling;
    switch (type) {
      default:
        Tag = "p";
        class_styling = "text-base";
        break;
      case "title":
        Tag = "h1";
        class_styling = "font-bold text-5xl";
        break;
      case "h1":
        Tag = "h1";
        class_styling = "font-bold text-4xl";
        break;
      case "h2":
        Tag = "h2";
        class_styling = "font-bold text-3xl";
        break;
      case "h3":
        Tag = "h3";
        class_styling = "font-bold text-2xl";
        break;
      case "h4":
        Tag = "h4";
        class_styling = "font-bold text-xl";
        break;
      case "h5":
        Tag = "h5";
        class_styling = "font-bold text-lg";
        break;
    }
  
    return (
      <div>
        <Tag
          style={style}
          className={className != undefined ? class_styling + " " + className : class_styling}
          id={id}
        >
          {text}{children}
        </Tag>
      </div >
    );
  }