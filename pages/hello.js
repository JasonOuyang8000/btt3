import Modal from '../components/Modal';
const hello = () => {
  return (
    <>
      <h1>Hello from web app</h1>
      <p style={{ backgroundColor: 'blue', color: 'white' }}>etc etc etc</p>
      <button style={{ backgroundColor: 'red', color: 'white' }}>Submit</button>
      <Modal />
    </>
  );
};

export default hello;
