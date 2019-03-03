import React, {useState} from 'react';
import {Label, Modal, Icon, Dimmer} from "semantic-ui-react";
import UploadImage from "../../vastuscomponents/components/manager/UploadImage";
import Spinner from "../../vastuscomponents/components/props/Spinner";
import ClientFunctions from "../../vastuscomponents/database_functions/UserFunctions";

type Props = {
    userID: string,
    profileImage: any
};

const ProfileImage = (props: Props) => {
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [tempProfilePicture, setTempProfilePicture] = useState(null);
    const uploadProfilePicture = (picture) => {
        if (props.user.id) {
            const path = "ClientFiles/" + props.user.id + "/profileImage";
            ClientFunctions.updateProfileImagePath(props.userID, props.userID, picture, path,
                (data) => {
                    // this.props.forceFetchUserAttributes(["profileImagePath"]);
                }, (error) => {
                    console.log("Failed edit client attribute");
                    console.log(JSON.stringify(error));
                });
        }
    };
    if (props.profileImage) {
        return (
            <div>
                <div className="u-avatar u-avatar--large u-margin-x--auto u-margin-top--neg4" style={{backgroundImage: `url(${props.profileImage})`}}>
                </div>
                <Label as="label" htmlFor="proPicUpload" circular className="u-bg--primaryGradient">
                    <Icon name="upload" className='u-margin-right--0' size="large" inverted />
                </Label>
                <input type="file" accept="image/*" id="proPicUpload" hidden={true}
                       onChange={(event) => {setTempProfilePicture(event.target.files[0]);setUploadModalOpen(true)}}/>
                <Modal basic size='mini' open={uploadModalOpen} onClose={setUploadModalOpen.bind(this, false)}>
                    <UploadImage imageURL={tempProfilePicture} callback={(picture) => {uploadProfilePicture(picture);setUploadModalOpen(false);}}/>
                </Modal>
            </div>
        );
    }
    else {
        return(
            <Dimmer inverted>
                <Spinner loading={true}/>
            </Dimmer>
        );
    }
};

export default ProfileImage;