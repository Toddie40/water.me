import Form from 'react-bootstrap/Form';

type SearchInputProps = {
  searchCallback: (value: string) => void;
};

export default function SearchInput({searchCallback}: SearchInputProps) {
  
  return (
    <>
        <Form.Control
        onChange={event => searchCallback(event.target.value)}
        type="text"
        placeholder="Search plant libary..."
        id="plantSearch"
        aria-describedby="searchHelp"
        />
      <Form.Text id="searchHelp" muted>
        Search is case sensitive because im lazy. Sorry I couldnt' be arsed to faff about.
      </Form.Text>
    </>
  );
}
