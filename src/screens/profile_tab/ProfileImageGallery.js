import React, {Component, useState} from 'react';
import {Grid, Icon, Button, Image, Header} from 'semantic-ui-react';
import ReactSwipe from 'react-swipe';
import ClientFunctions from "../../vastuscomponents/database_functions/ClientFunctions";
import _ from "lodash";
import {connect} from 'react-redux';
import {forceFetchUserAttributes} from "../../redux_helpers/actions/userActions";

class ProfileImageGallery extends Component<Props> {
    state = {
        isLoading: false,
        reactSwipeElement: null
    };

    constructor(props) {
        super(props);
        this.setGalleryPicture = this.setGalleryPicture.bind(this);
    }


    setGalleryPicture(event) {
        //console.log("This is calling set gallery picture");
        //console.log(this.state.galleryNum);
        alert(this.state.reactSwipeElement.getPos());
        const path = "ClientFiles/" + this.props.user.id + "/galleryImages" + this.state.reactSwipeElement.getPos();
        const image = event.target.files[0];
        this.setState({isLoading: true});
        ClientFunctions.addProfileImage(this.props.user.id, this.props.user.id, image, path, (data) => {
            this.props.forceFetchUserAttributes(["profileImagePaths"]);
            this.setState({isLoading: false});
        }, (error) => {
            //console.log("Failed edit client attribute");
            //console.log(JSON.stringify(error));
        });
    };

    getImageComponents() {
        if (this.props.user.hasOwnProperty("profileImage") && this.props.user.profileImages
            && this.props.user.profileImages.length > 0) {
            return _.times(this.props.user.profileImages.length, i => (
                <div>
                    <Image src={this.props.user.profileImages[i]} style={{
                        height: '300px',
                        width: '300px',
                        margin: 'auto', marginTop: "10px"
                    }}/>
                    {/*<div style={{backgroundImage: `url(${this.props.user.profileImages[i]})`}}>*/}
                    {/*<Image src={this.props.user.profileImages[i]} style={{*/}
                        {/*height: '300px',*/}
                        {/*width: '300px',*/}
                        {/*margin: 'auto', marginTop: "10px"*/}
                    {/*}}>*/}
                        {/*this.state.galleryURLS[i] + " Num: " + i*/}
                        {/*{this.state.galleryNumber = i}*/}
                    {/*</Image>*/}
                        <Grid centered>
                            <Button primary as="label" htmlFor="galleryUpload" circular className="u-bg--primaryGradient"
                                    style={{marginTop: "20px", marginBottom: "20px"}}>
                                Change Picture
                            </Button>
                            <input type="file" accept="image/*" id="galleryUpload" hidden={true}
                                   onChange={this.setGalleryPicture}/>
                        </Grid>
                </div>
            ));
        }
        else {
            return (
                <Header> No gallery images yet! </Header>
            );
        }
    };



    render() {
        return (
            <div>
                <Grid centered>
                    <Grid.Column width={1} style={{marginRight: "10px"}} onClick={() => this.state.reactSwipeElement.prev()}>
                        <Icon size='large' name="caret left" style={{marginTop: "150px"}}/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <ReactSwipe
                            className="carousel"
                            swipeOptions={{continuous: false}}
                            ref={el => {this.state.reactSwipeElement = el}}
                        >
                            {this.getImageComponents()}
                            <div style={{width: "50px"}} align="center">
                                <Button primary as="label" htmlFor="galleryUpload" circular
                                        className="u-bg--primaryGradient"
                                        style={{marginTop: "140px", marginBottom: "140px"}}>
                                    <Icon name='plus'/> Add New Picture
                                </Button>
                                <input type="file" accept="image/*" id="galleryUpload" hidden={true}
                                       onChange={this.setGalleryPicture}
                                       onClick={() => {this.setState({galleryNumber: this.props.user.profileImages.length})}}/>
                            </div>
                        </ReactSwipe>
                    </Grid.Column>
                    <Grid.Column width={1} style={{marginRight: "10px", marginLeft: "-10px"}}
                                 onClick={() => this.state.reactSwipeElement.next()}>
                        <Icon size='large' name="caret right" style={{marginTop: "150px"}}/>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => {
    return {
        forceFetchUserAttributes: (variableList, dataHandler) => {
            dispatch(forceFetchUserAttributes(variableList, dataHandler));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileImageGallery);