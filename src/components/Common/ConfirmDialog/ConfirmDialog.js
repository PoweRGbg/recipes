import { Modal, Button } from 'react-bootstrap';

export default function ConfirmDialog ({
    show,
    onClose,
    onSave,
    text
})  {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{text}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>No</Button>
                <Button variant="primary" onClick={onSave}>Yes</Button>
            </Modal.Footer>
        </Modal>
    );
};

