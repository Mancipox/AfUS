import React, { Component } from 'react'
import { Card, Button } from 'react-bootstrap'
import QRCode from 'qrcode.react'
import * as firebase from 'firebase';
import ReactInterval from 'react-interval'


const style_card_qr = {
    "marginTop": "45px",
    "width": "50%",
    "float": 'left'
}

const style_card_students = {
    "marginTop": "45px",
    "width": "50%",
    "float": 'right'
}

var db;

class qr_page_professor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dict_codes: [{ text: '' }],
            rand_index: 0,
            selected_code: "no data avaliable",
            students: []
        }
        this.changeQR = this.changeQR.bind(this)
    }

    componentDidMount() {
        let dict_codes = []
        firebase.initializeApp(config);
        db = firebase.firestore();
        db.collection('codes').get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    dict_codes.push({ text: doc.data() });
                });
                var rand = parseInt(Math.random() * (5 - 0))
                this.setState({ dict_codes, rand_index: rand, selected_code: dict_codes[rand].text.code })
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
        this.listenerFi()
    }

    setSelectedCode(code) {
        let docNewCode = db.collection('current_code').doc("123");
        docNewCode.set({
            code: code
        });
    }

    listenerFi() {
        let student_list = [...this.state.students]
        let doc = db.collection('student').doc("123")
        doc.onSnapshot(docSnapshot => {
            if (docSnapshot.data()) {
                student_list.push({ name: docSnapshot.data().name, id: docSnapshot.data().id, image: docSnapshot.data().image })
                this.setState({ students: student_list })
            }
        }, err => {
            console.log(`Encountered error: ${err}`);
        });

    }


    changeQR() {
        var rand = 0;
        do {
            rand = parseInt(Math.random() * (5 - 0))
        } while (rand === this.state.rand_index)
        this.setState({ selected_code: this.state.dict_codes[rand].text.code, rand_index: rand }, () => { this.setSelectedCode(this.state.selected_code) })
    }

    render() {
        return (
            <div>
                <Card style={style_card_qr}>
                    <ReactInterval timeout={10000} enabled={true}
                        callback={this.changeQR} />
                    <QRCode style={{ margin: 'auto', height: '450px', width: '450px' }} value={this.state.selected_code} />
                    <Card.Body>
                        <Card.Title>Escanea este código para marcar tu asistencia</Card.Title>
                        <Button variant="primary">Finalizar toma de asistencia</Button>
                    </Card.Body>
                </Card>
                <Card style={style_card_students}>
                    <Card.Body>
                        {this.state.students.map(student => {
                            return (<Card>
                                <Card.Body>
                                    <Card.Img variant="top" src={student.image}/>
                                    <Card.Title key={student.id}>{student.name}</Card.Title>
                                    <Card.Text>
                                        {student.id}
                                    </Card.Text>
                                </Card.Body>
                            </Card>)
                        })}
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default qr_page_professor