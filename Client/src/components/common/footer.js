import React from "react";
import bguLogo from "../../static/bengurion_logo.png";

const Footer = () => (
  <div className="ui footer basic segment">
    <div className="ui text container" style={{ fontSize: "0.85em" }}>
      <h4><b>This website is free and open to all users. There is no login requirement.</b></h4>
      <h4>
        <b>References:</b>
      </h4>
      <ol>
        <li>
          Sharon M., Gil Gruber, Argov C.M, Volozhinsky M., Yeger-Lotem E.
          <br />
          <b>
            <a
                href="https://academic.oup.com/nar/advance-article/doi/10.1093/nar/gkad421/7173756?utm_source=advanceaccess&utm_campaign=nar&utm_medium=email"
                target="_blank" rel="noopener noreferrer">
              <i>
                ProAct: quantifying the differential activity of biological processes in tissues, cells, and user-defined contexts
              </i>
            </a>
            <br />
          </b>
          <i>
            Nucleic Acids Research, 2023;, gkad421,  <a href="https://doi.org/10.1093/nar/gkad421" target="_blank" rel="noopener noreferrer">https://doi.org/10.1093/nar/gkad421</a>
          </i>
          <br />
        </li>
        <li>
          Sharon M, Vinogradov E, Argov CM, Lazarescu O, Zoabi Y, Hekselman I,
          Yeger-Lotem E.
          <br />
          <b>
            <a
              href="https://academic.oup.com/bioinformatics/advance-article/doi/10.1093/bioinformatics/btab883/6500320?login=true"
              target="_blank" rel="noopener noreferrer">
              <i>
                The differential activity of biological processes in tissues and
                cell subsets can illuminate disease-related processes and cell
                type identities.
              </i>

            </a>
            <br />

          </b>
          <i>
            Bioinformatics, 2022. doi: 10.1093/bioinformatics/btab883. PMID:
            35015838
          </i>
          <br />
        </li>
      </ol>
      <img
        src={bguLogo}
        className="ui left floated image"
        alt="Ben-Gurion University of the Negev logo"
      />
    </div>
  </div>
);

export default Footer;
