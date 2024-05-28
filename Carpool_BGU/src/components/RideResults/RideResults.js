import Typography from "@mui/material/Typography";
import * as React from "react";
import Box from "@mui/material/Box";
import {List} from "@mui/material";
import RideResultItem from "./RideResultItem";

export default function RideResults({results, handleCloseDialog, context}) {
    return (
        <Box>
            {results.length === 0 ? (
                    <Typography>לצערנו לא מצאנו עבורך טרמפים קרובים</Typography>
                ) :
                (results.length > 1 ? (
                        <Typography>מצאנו עבורך {results.length} טרמפים אפשריים!</Typography>
                    ) : (
                        <Typography>מצאנו עבורך טרמפ אפשרי!</Typography>
                    )
                )}
            <List>
                {results.map(item => (
                    <RideResultItem
                        key={item.ride_id}
                        item={item}
                        handleCloseDialog={handleCloseDialog}
                        context={context}/>
                ))}
            </List>
        </Box>
    )
}