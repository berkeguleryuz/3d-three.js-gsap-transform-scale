export interface DataType {
  id: number;
  heading: string;
  subheading: string;
  text: string;
  swatchColor: string;
  background: string;
  headingColor: string;
  subHeadingColor: string;
  textColor: string;
  buttonColor: {
    text: string;
    background: string;
  };
  itemList?: { [key: string]: { color: string } };
}
