import React from 'react'
import {Button, Card, Modal, Dimmer, Loader, List, Icon, Label, Divider, Image, Grid} from 'semantic-ui-react'
import { Storage } from 'aws-amplify';
import S3 from "../../vastuscomponents/api/S3Storage";
import _ from 'lodash'
import ChallengeList from "../../vastuscomponents/components/lists/ChallengeList";
import {fetchUserAttributes, forceFetchUserAttributes} from "../../redux_helpers/actions/userActions";
import { connect } from "react-redux";
import {logOut} from "../../redux_helpers/actions/authActions";
import ClientFunctions from "../../vastuscomponents/database_functions/ClientFunctions";
import ReactSwipe from "react-swipe";
import { parseISOString } from "../../vastuscomponents/logic/TimeHelper";
import ClientList from "../../vastuscomponents/components/lists/ClientList";
import DatabaseObjectList from "../../vastuscomponents/components/lists/DatabaseObjectList";
import UploadImage from "../../vastuscomponents/components/manager/UploadImage";

/**
* ProfileTab
*
* This is the profile page which displays information about the current user.
 */
class ProfileTab extends React.PureComponent {

    state = {
        isLoading: true,
        checked: false,
        sentRequest: false,
        tempProfilePictureURL: null,
        uploadProfileModalOpen: false,
        buddyModalOpen: false,
        scheduledModalOpen: false,
        ownedModalOpen: false,
        galleryNum: 0,
        galleryURLS: [],
        error: null
    };

    toggle = () => this.setState({ checked: !this.state.checked });

    constructor(props) {
        // console.log("constructor");
        // console.log("constructor props: " + JSON.stringify(props));
        super(props);
        // this.setState({isLoading: true, checked: false, error: null});
        // ("Got into ProfileTab constructor");
        this.setPicture = this.setPicture.bind(this);
        this.setGalleryPicture = this.setGalleryPicture.bind(this);
        this.update = this.update.bind(this);
        this.profilePicture = this.profilePicture.bind(this);
        this.uploadProfilePicture = this.uploadProfilePicture.bind(this);
        this.openUploadProfileModal = this.openUploadProfileModal.bind(this);
        this.closeUploadProfileModal = this.closeUploadProfileModal.bind(this);
        this.openBuddyModal = this.openBuddyModal.bind(this);
        this.closeBuddyModal = this.closeBuddyModal.bind(this);
        this.openScheduledModal = this.openScheduledModal.bind(this);
        this.closeScheduledModal = this.closeScheduledModal.bind(this);
        this.openOwnedModal = this.openOwnedModal.bind(this);
        this.closeOwnedModal = this.closeOwnedModal.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
        this.imageGallery = this.imageGallery.bind(this);
        this.setURLS = this.setURLS.bind(this);
    }

    resetState() {
        this.setState({
            isLoading: true,
            checked: false,
            sentRequest: false,
            buddyModalOpen: false,
            scheduledModalOpen: false,
            completedModalOpen: false,
            ownedModalOpen: false,
            galleryNum: 0,
            galleryURLS: [],
            error: null,
        });
    }

    componentDidMount() {
        // console.log("componentDidMount");
        this.update();
        // this.props.fetchUserAttributes(["name", "username", "birthday", "profileImagePath", "challengesWon", "profilePicture", "friends", "challenges", "ownedChallenges", "completedChallenges", "profileImagePaths"]);
        //console.log(JSON.stringify(this.props.user.profileImagePaths));
        //console.log(JSON.stringify(this.state.galleryURLS));
    }

    componentWillReceiveProps(newProps, nextContext) {
        // console.log("componentWillReceiveProps");
        // console.log("receive props: " + JSON.stringify(newProps));
        if (newProps.user.profileImagePath) {
            this.setState({isLoading: true});
        }
        if (newProps.user && this.props.user && newProps.user.id !== this.props.user.id) {
            this.resetState();
        }
        this.update();
    }

    update() {
        const user = this.props.user;
        // console.log("Updating. User = " + JSON.stringify(user) + ". State = " + JSON.stringify(this.state));
        if (!user.id) {
            // console.log("ID is not set inside profile... This means a problem has occurred");
        }
        //this.props.fetchUserAttributes(["name", "username", "birthday", "profileImagePath", "challengesWon", "profilePicture", "friends", "challenges", "ownedChallenges", "completedChallenges", "profileImagePaths"]);
        if (!this.state.sentRequest) {
            this.setState({sentRequest: true});
            this.props.fetchUserAttributes(["name", "username", "birthday", "profileImagePath", "challengesWon", "friends", "challenges", "ownedChallenges", "completedChallenges", "profileImagePaths"]);
        }
        else {
            this.setState({isLoading: false});
        }
        if(this.props.user.profileImagePaths) {
            this.setURLS(this.props.user.profileImagePaths);
        }
    }

    setPicture(event) {
        //console.log("This is calling regular set picture");
        if (this.props.user.id) {

            const path = "/ClientFiles/" + this.props.user.id + "/profileImage";
            //console.log("Calling storage put");
            //console.log("File = " + JSON.stringify(event.target.files[0]));
            Storage.put(path, event.target.files[0], { contentType: "video/*;image/*" }).then((result) => {
                // Now we update the database object to reflect this
                //console.log("resulttt:" + JSON.stringify(result));
                //console.log("Successfully put the image, now putting the data into the database!");
                ClientFunctions.updateProfileImagePath(this.props.user.id, this.props.user.id, path,
                    (data) => {
                        //console.log("successfully editted client");
                        //console.log(JSON.stringify(data));
                        this.props.forceFetchUserAttributes(["profileImagePath"]);
                        this.setState({isLoading: true});
                    }, (error) => {
                        console.log("Failed edit client attribute");
                        console.log(JSON.stringify(error));
                    });
                this.setState({isLoading: true});
            }).catch((error) => {
                console.log("failed storage put");
                console.log(error);
            });
        }
    }

    uploadProfilePicture(picture) {

        if (this.props.user.id) {
            const path = "ClientFiles/" + this.props.user.id + "/profileImage";
            //console.log("Calling storage put");
            //console.log("File = " + JSON.stringify(event.target.files[0]));
            // Storage.put(path, picture, { contentType: "video/*;image/*" }).then((result) => {
            S3.putImage(path, picture, (result) => {
                // Now we update the database object to reflect this
                console.log("resulttt:" + JSON.stringify(result));
                //console.log("Successfully put the image, now putting the data into the database!");
                ClientFunctions.updateProfileImagePath(this.props.user.id, this.props.user.id, path,
                    (data) => {
                        this.props.forceFetchUserAttributes(["profileImagePath"]);
                        this.setState({isLoading: true});
                    }, (error) => {
                        console.log("Failed edit client attribute");
                        console.log(JSON.stringify(error));
                    });
                this.setState({isLoading: true});
            }, (error) => {
                console.log("failed storage put");
                console.log(error);
            });
        }
    }

    setGalleryPicture(event) {
        //console.log("This is calling set gallery picture");
        if (this.props.user.id) {
            //console.log(this.state.galleryNum);
            const path = "/ClientFiles/" + this.props.user.id + "/galleryImages" + this.state.galleryNum;
            const image = event.target.files[0];
            this.setState({isLoading: true});
            ClientFunctions.addProfileImage(this.props.user.id, this.props.user.id, image, path, (data) => {
                this.props.forceFetchUserAttributes(["profileImagePaths"]);
                this.setURLS(this.props.user.profileImagePaths);
                this.setState({isLoading: false});
            }, (error) => {
                //console.log("Failed edit client attribute");
                //console.log(JSON.stringify(error));
            });
            //console.log("Calling storage put");
            //console.log("File = " + JSON.stringify(event.target.files[0]));
            // Storage.put(path, event.target.files[0], { contentType: "image/*" }).then((result) => {
                // Now we update the database object to reflect this
                //console.log("resulttt:" + JSON.stringify(result));
                //console.log("Successfully put the image, now putting the data into the database!");
            //     ClientFunctions.addProfileImagePath(this.props.user.id, this.props.user.id, path,
            //         (data) => {
            //             //console.log("successfully editted client");
            //             //console.log(JSON.stringify(data));
            //             this.props.forceFetchUserAttributes(["profileImagePaths"]);
            //             this.setURLS(this.props.user.profileImagePaths);
            //             this.setState({isLoading: true});
            //         }, (error) => {
            //             console.log("Failed edit client attribute");
            //             console.log(JSON.stringify(error));
            //         });
            //     this.setState({isLoading: true});
            // }).catch((error) => {
            //     console.log("failed storage put");
            //     console.log(error);
            // });
        }
    }

    setURLS(paths) {
        //console.log("Setting URLS");
        if(paths) {
            for (let i = 0; i < paths.length; i++) {
                if (this.state.galleryURLS) {
                    Storage.get(paths[i]).then((url) => {
                        let tempGal = this.state.galleryURLS;
                        tempGal[i] = url;
                        this.setState({galleryURLS: tempGal});
                        //console.log(JSON.stringify(this.state.galleryURLS));
                    }).catch((error) => {
                        console.error("ERROR IN GETTING VIDEO FOR COMMENT");
                        console.error(error);
                    });
                }
            }
        }
    }

    imageGallery = () => {
        if(this.props.user.profileImagePaths) {
            //console.log(JSON.stringify(this.props.user.profileImagePaths));
            this.update();
        }
        //console.log(JSON.stringify(this.state.galleryURLS));
        if(this.state.galleryURLS.length > 0) {
            //console.log(JSON.stringify(this.state.galleryURLS));
            return _.times(this.state.galleryURLS.length, i => (
                <div>
                    <Image src={this.state.galleryURLS[i]} style={{height: '300px',
                            width: '300px',
                            margin: 'auto', marginTop: "10px"}}>
                            {/*this.state.galleryURLS[i] + " Num: " + i*/}
                            {this.setState({galleryNum: i})}
                    </Image>
                    <Grid centered>
                        <Button primary as="label" htmlFor="galleryUpload" circular className="u-bg--primaryGradient" style={{marginTop: "20px", marginBottom: "20px"}}>
                            Change Picture
                        </Button>
                        <input type="file" accept="image/*" id="galleryUpload" hidden={true}
                               onChange={this.setGalleryPicture} onClick={this.setState({galleryNum: i})}/>
                    </Grid>
                </div>
            ));
        }
    };

    profilePicture() {
        if (this.props.user.profileImage) {
            return (
                <div>
                    <div className="u-avatar u-avatar--large u-margin-x--auto u-margin-top--neg4" style={{backgroundImage: `url(${this.props.user.profileImage})`}}>
                    </div>
                    <Label as="label" htmlFor="proPicUpload" circular className="u-bg--primaryGradient">
                        <Icon name="upload" className='u-margin-right--0' size="large" inverted />
                    </Label>
                    <input type="file" accept="image/*" id="proPicUpload" hidden={true}
                           onChange={(event) => {this.setState({tempProfilePictureURL: event.target.files[0]});this.openUploadProfileModal();}}
                           onClick={this.setState()}/>
                    <Modal basic size='mini' open={this.state.uploadProfileModalOpen} onClose={this.closeUploadProfileModal}>
                        <UploadImage imageURL={this.state.tempProfilePictureURL} callback={(picture) => {this.uploadProfilePicture(picture);this.closeUploadProfileModal();}}/>
                    </Modal>
                </div>
            );
        }
        else {
            return(
                <Dimmer inverted>
                    <Loader />
                </Dimmer>
            );
        }
    }

    handleLogOut() {
        // console.log("logging out");
        this.props.logOut();
        // this.setState({isLoading: true});
        // Auth.signOut({global: true}).then((data) => {
        //     console.log("Successfully signed out!");
        //     console.log(data);
        //     this.setState({isLoading: false, username: null});
        //     this.props.signOut();
        // }).catch((error) => {
        //     console.log("Sign out has failed :(");
        //     console.log(error);
        //     this.setState({error: error, isLoading: false});
        // });
    }

    openUploadProfileModal = () => { this.setState({uploadProfileModalOpen: true}); };
    closeUploadProfileModal = () => { this.setState({uploadProfileModalOpen: false}); };
    openBuddyModal = () => { this.setState({buddyModalOpen: true}); };
    closeBuddyModal = () => { this.setState({buddyModalOpen: false}); };
    openScheduledModal = () => { this.setState({scheduledModalOpen: true}); };
    closeScheduledModal = () => { this.setState({scheduledModalOpen: false}); };
    openCompletedModal = () => { this.setState({completedModalOpen: true}); };
    closeCompletedModal = () => { this.setState({completedModalOpen: false}); };
    openOwnedModal = () => { this.setState({ownedModalOpen: true}); };
    closeOwnedModal = () => { this.setState({ownedModalOpen: false}); };


    render() {
        //console.log(JSON.stringify(this.state));
        /**
         * This creates an error message from the given error string
         * @param error A string containing the error message that was invoked
         * @returns {*} Returns a Semantic-ui script for displaying the error
         */
        // function errorMessage(error) {
        //     if (error) {
        //         return (
        //             <Message color='red'>
        //                 <h1>Error!</h1>
        //                 <p>{error}</p>
        //             </Message>
        //         );
        //     }
        // }

        /**
         *
         * @param profilePicture Displays the
         * @returns {*}
         */

        function numChallengesWon(challengesWon) {
            if (challengesWon && challengesWon.length) {
                return challengesWon.length;
            }
            return 0;
        }

        if (this.state.isLoading) {
            return(
                <Dimmer>
                    <Loader/>
                </Dimmer>
            )
        }

        let reactSwipeEl;
        //This displays some basic user information, a profile picture, buttons to modify some user related attributes,
        //and a switch to set the privacy for the user.
        return(
            <Card fluid raised className="u-margin-top--2">
                <Card.Content textAlign="center">
                    {this.profilePicture()}
                    <Card.Header as="h2" style={{"margin": "12px 0 0"}}>{this.props.user.name}</Card.Header>
                    <Card.Meta>Event Wins: {numChallengesWon(this.props.user.challengesWon)}</Card.Meta>
                    <List id = "profile buttons">
                        <List.Item>
                            <Modal closeIcon trigger={<Button primary fluid size="large"><Icon name="picture" /> Photo Gallery</Button>} >
                                <div>
                                    <Grid centered>
                                        <Grid.Column width={1} style={{marginRight: "10px"}} onClick={() => reactSwipeEl.prev()}>
                                            <Icon size='large' name="caret left" style={{marginTop: "150px"}}/>
                                        </Grid.Column>
                                        <Grid.Column width={10}>
                                            <ReactSwipe
                                                className="carousel"
                                                swipeOptions={{ continuous: false }}
                                                ref={el => (reactSwipeEl = el)}
                                            >
                                                {this.setURLS(this.props.user.profileImagePaths)}
                                                {this.imageGallery()}
                                                <div style={{width: "50px"}} align="center">
                                                    <Button primary as="label" htmlFor="galleryUpload" circular className="u-bg--primaryGradient" style={{marginTop: "140px", marginBottom: "140px"}}>
                                                        <Icon name='plus'/> Add New Picture
                                                    </Button>
                                                    <input type="file" accept="image/*" id="galleryUpload" hidden={true}
                                                           onChange={this.setGalleryPicture} onClick={this.setState({galleryNum: this.state.galleryURLS.length})}/>
                                                </div>
                                            </ReactSwipe>
                                        </Grid.Column>
                                        <Grid.Column width={1} style={{marginRight: "10px", marginLeft: "-10px"}} onClick={() => reactSwipeEl.next()}>
                                            <Icon size='large' name="caret right" style={{marginTop: "150px"}}/>
                                        </Grid.Column>
                                    </Grid>
                                </div>
                            </Modal>
                        </List.Item>
                        <List.Item>
                            <Button primary fluid size="large" onClick={this.openBuddyModal.bind(this)}><Icon name="users" /> Buddy List</Button>
                            <Modal basic size='mini' open={this.state.buddyModalOpen} onClose={this.closeBuddyModal.bind(this)} closeIcon>
                                <Modal.Content image>
                                    <DatabaseObjectList
                                        ids={this.props.user.friends}
                                        noObjectsMessage={"No friends yet!"}
                                        acceptedItemTypes={["Client", "Trainer"]}
                                    />
                                    {/*<ClientList*/}
                                        {/*clientIDs={this.props.user.friends}*/}
                                        {/*noClientsMessage={"No Friends yet!"}*/}
                                        {/*// sortFunction={(a, b) => {}}*/}
                                    {/*/>*/}
                                </Modal.Content>
                            </Modal>
                        </List.Item>
                        <Divider />
                        <List.Item>
                            <Button primary fluid size="large" onClick={this.openOwnedModal.bind(this)}><Icon name="trophy" /> Created Challenges</Button>
                            <Modal basic size='mini' open={this.state.ownedModalOpen} onClose={this.closeOwnedModal.bind(this)} closeIcon>
                                <Modal.Content>
                                    <ChallengeList challengeIDs={this.props.user.ownedChallenges} noChallengesMessage={"No Owned Challenges Yet!"}/>
                                </Modal.Content>
                            </Modal>
                        </List.Item>
                        <List.Item>
                            <Button primary fluid size="large" onClick={this.openScheduledModal.bind(this)}><Icon name="checked calendar" /> Scheduled Challenges</Button>
                            <Modal basic size='mini' open={this.state.scheduledModalOpen} onClose={this.closeScheduledModal.bind(this)} closeIcon>
                                <Modal.Content>
                                    <ChallengeList challengeIDs={this.props.user.challenges} noChallengesMessage={"No Scheduled Challenges Yet!"}/>
                                </Modal.Content>
                            </Modal>
                        </List.Item>
                        <List.Item>
                            <Button fluid size="large" onClick={this.openCompletedModal.bind(this)}><Icon name="bookmark outline" />Completed Challenges</Button>
                            <Modal basic size='mini' open={this.state.completedModalOpen} onClose={this.closeCompletedModal.bind(this)} closeIcon>
                                <Modal.Content>
                                    <ChallengeList challengeIDs={this.props.user.completedChallenges} noChallengesMessage={"No completed challenges yet!"}/>
                                </Modal.Content>
                            </Modal>
                        </List.Item>
                        <Divider />
                        <List.Item>
                            <Button fluid inverted size="large" onClick={this.handleLogOut.bind(this)} width={5}>Log Out</Button>
                        </List.Item>
                    </List>       
                </Card.Content>          
            </Card>
        );
    }
}

// {/*<div className="Privacy Switch">*/}
//     {/*<Checkbox toggle onClick={this.handleAccessSwitch} onChange={this.toggle} checked={this.state.checked}/>*/}
//     {/*<div>{this.state.userInfo.access}</div>*/}
// {/*</div>*/}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (variablesList, dataHandler) => {
            dispatch(fetchUserAttributes(variablesList, dataHandler));
        },
        forceFetchUserAttributes: (variablesList) => {
            dispatch(forceFetchUserAttributes(variablesList));
        },
        logOut: () => {
            dispatch(logOut());
        },

        // fetchUser: (username) => {
        //     dispatch(fetchUser(username));
        // }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileTab);