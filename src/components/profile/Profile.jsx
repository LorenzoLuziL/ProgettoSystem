import React, { useEffect, useState } from "react";
import { Person, Mail } from "@mui/icons-material";
import "./profile.scss";
import {
    thorPortfolio,
    capPortfolio,
    hulkPortfolio,
    ironmanPortfolio
} from '../../data';
import AgentService from '../../ssi/AgentService';
import $, { get } from 'jquery';
import StatusBar from '../statusBar/StatusBar';
import {
    getCredDefIdAPI, getCredDefIdDetailsAPI, getCredentialWalletAPI,
    getSchemaIdAPI, getSchemaDetailsAPI, getIssuedCredentialAPI, revokeCredAPI, checkRevocationAPI, getPresentationsAPI
} from "../../components/util/APIUtils";
import { _agents } from "../../ssi/config";
import { values } from "min-dash";
import { ProSidebarProvider, Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Card from 'react-bootstrap/Card';
import { MDBBtn } from 'mdb-react-ui-kit';
import CardGroup from 'react-bootstrap/CardGroup';


const Profile = (props) => {

    const [schema, setSchema] = useState([]);
    const [credDef, setCredDef] = useState([]);
    const [credWallet, setCredWallet] = useState([]);
    const [issuedCred, setIssuedCred] = useState([]);
    const [revocated, setRevocated] = useState([]);
    const [proof, setProof] = useState([]);



    const [value, setValue] = useState("");




    useEffect(() => {
        getData();

        //getAllModels();
    }, [])


    function getData(value) {
        if (value === undefined || "") {
            value = 8041;
        }


        console.log('argument from Child: ', value);

        getCredDefIdAPI(value).then(res =>

            getCredDefIdDetailsAPI(value, res.credential_definition_ids[0]).then(res =>
                setCredDef(res.credential_definition))
        )

        getSchemaIdAPI(value).then(res =>

            getSchemaDetailsAPI(value, res.schema_ids[0]).then(res =>
                setSchema(res.schema))
        )

        getCredentialWalletAPI(value).then(res => {
            setCredWallet(res.results);
            var cred = res.results.map(entry => entry.referent)[0];
            console.log("ref", res.results.map(entry => entry.referent)[0]);
            checkRevocationAPI(value, cred).then(res => setRevocated(res.revoked))
        })

        getIssuedCredentialAPI(value).then(res => setIssuedCred(res.results.filter(entry =>
            entry.state === "credential_acked" && entry.role === "issuer")))

        getPresentationsAPI(value).then(res => setProof(res.results.filter(entry =>
            entry.state === "verified")))
    }



    const handleChange = (value) => {
        // 👇️ take the parameter passed from the Child component
        value === "one" ? setValue(8041) : setValue(value);
        setCredDef("");
        setSchema("");
        setCredWallet("");
        setIssuedCred("");
        setProof("");
        getData(value);
    };

    function revokeIssuedCred(cred, conn) {

        revokeCredAPI(value, cred, conn).then(res => console.log("revoked", res))

    }

    function checkRevocation(credId) {

    }



    return (
        <div className="profile" id="profile">
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous"></link>

            <ProSidebarProvider >

                <h1>Agents </h1>
                <StatusBar onValue={handleChange} />
                <div style={{ display: 'flex', flexDirection: 'row', }}>
                    <CardGroup style={{justifyContent:"center"}}>
                        {schema.length !== 0 ?
                            <div style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                                <Card border="primary" style={{ width: '30rem' }} >
                                    <Card.Header>Created Schemas</Card.Header>
                                    <Card.Body>
                                        <Card.Title>{schema.name}</Card.Title>
                                        <Card.Text>
                                            {schema.id}
                                        </Card.Text>
                                        {schema.attrNames.map((name) =>
                                            <Card.Text>
                                                {name}
                                            </Card.Text>)}
                                    </Card.Body>
                                </Card>
                                <br /> </div> : <div />}

                        {credDef.length !== 0 ?
                            <div style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                                <Card border="primary" style={{ width: '40rem' }} >
                                    <Card.Header>Credential Definition</Card.Header>
                                    <Card.Body>
                                        <Card.Title>{credDef.id}</Card.Title>
                                        <Card.Text>
                                            Schema Id: {credDef.schemaId}
                                        </Card.Text>
                                        <Card.Text>
                                            Tag: {credDef.tag}
                                        </Card.Text>
                                        <Card.Text>
                                            Version: {credDef.ver}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                                <br /> </div> : <div />}

                        {credWallet.length !== 0 ?
                            credWallet.map((entry) =>
                                <div style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                                    <Card className="mb-2" border={revocated === false ? "success" : "danger"} style={{ width: '40rem' }} >
                                        <Card.Header>Credential</Card.Header>
                                        <Card.Body>
                                            <Card.Title >{entry.schema_id}</Card.Title>
                                            <Card.Text>
                                                Schema Id: {entry.cred_def_id}
                                            </Card.Text>
                                            {Object.keys(entry.attrs).map((name, key) =>
                                                <Card.Text key={key}>
                                                    {name} : {entry.attrs[name]}
                                                </Card.Text>)}

                                            {revocated === true ? <Card.Text style={{ color: "crimson", fontWeight: "bold" }} > Revoked </Card.Text> :
                                                <Card.Text style={{ color: "green", fontWeight: "bold" }}>Not Revoked</Card.Text>}


                                        </Card.Body>
                                    </Card>
                                    <br /> </div>)
                            : <div />}

                        {issuedCred.length !== 0 ?
                            issuedCred.map((entry) =>
                                <div style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                                    <Card border="info" style={{ width: '40rem', borderColor: "red" }} >
                                        <Card.Header>Issued Credential </Card.Header>
                                        <Card.Body>
                                            <Card.Title id="credExId">{entry.credential_exchange_id}</Card.Title>
                                            <Card.Text>
                                                Schema Id:{entry.schema_id}
                                            </Card.Text>
                                            <Card.Text id="connId">
                                                Credential Id: {entry.credential_definition_id}
                                            </Card.Text>
                                            <Card.Text>
                                                Issued to: {entry.connection_id}
                                            </Card.Text>
                                            <MDBBtn onClick={() => revokeIssuedCred(entry.credential_exchange_id, entry.connection_id)} >Revoke</MDBBtn>
                                        </Card.Body>
                                    </Card>
                                    <br /> </div>)
                            : <div />}

                        {proof.length !== 0 ?
                            proof.map((entry) =>
                                <div style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                                    <Card className="mb-2" border={entry.verified === "true" ? "success" : "danger"} style={{ width: '40rem' }} >
                                        <Card.Header>Presentation</Card.Header>
                                        <Card.Title style={{paddingLeft:"10px"}}> {entry.presentation_request.name}</Card.Title>
                                        <Card.Body>
                                            <Card.Text>
                                                Id: {entry.presentation_exchange_id}
                                            </Card.Text>
                                            <Card.Text>
                                                Created at {entry.created_at}
                                            </Card.Text>
                                            {entry.verified === "false" ? <Card.Text style={{ color: "crimson", fontWeight: "bold" }} > Not Verified </Card.Text> :
                                                <Card.Text style={{ color: "green", fontWeight: "bold" }}>Verified</Card.Text>}


                                        </Card.Body>
                                    </Card>
                                    <br /> </div>)
                            : <div />}
                    </CardGroup>
                </div>
                {console.log("valueee", value)}

                {console.log("schema", schema)}
                {console.log("credWallet", credWallet)}
                {console.log("proof", proof)}

            </ProSidebarProvider>

        </div>
    );
}

export default Profile;

