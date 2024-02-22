import {BASE_API_URL} from "../../config/environment";
import { Link } from 'react-router';
export default [
    {
        key: 'Query ProAct',
        name: 'Query ProAct',
        href: 'https://netbio.bgu.ac.il/ProAct/',
        title: 'Query ProAct'
    },
    {
        key: 'Tutorial',
        name: 'Tutorial',
        href: 'https://netbio.bgu.ac.il/labwebsite/proact-tutorial/',
        title: 'Tutorial'
    },
    {
        key: 'Download data',
        name: 'Download data',
        link: `download`,
    },
    {
        key: 'Single-cell example output:',
        name: 'Single-cell example output:',
        title: 'Single-cell example output:',
        options: [{
            key: 'Top preferentially active processes for separate subsets',
            name: 'Top preferentially active processes for separate subsets',
            text: 'Top preferentially active processes for separate subsets',
            href: 'https://netbio.bgu.ac.il/ProAct/#userExpRanks/Kidney-Megakaryocytes/a2e317a7-c683-494a-bcc9-7dba024ce936/2022-12-10%2015_54_09'
        },
            {
                key: 'Suggested cell-type annotations',
                name: 'Suggested cell-type annotations',
                text: 'Suggested cell-type annotations',
                href: 'https://netbio.bgu.ac.il/ProAct/#cellIdentityGroupsData/a2e317a7-c683-494a-bcc9-7dba024ce936/2022-12-10%2015_58_26'
            }
        ]
    },
    {
        key: 'FAQ',
        name: 'FAQ',
        href: 'https://netbio.bgu.ac.il/labwebsite/ProAct-faq/',
        title: 'FAQ'
    },
    {
        key: 'Contact us',
        name: 'Contact us',
        href: 'https://netbio.bgu.ac.il/labwebsite/contact-us/',
        title: 'Contact Us'
    }
];
