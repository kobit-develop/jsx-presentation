import fs from 'fs'
import JSZip from 'jszip'
import { execSync } from 'child_process'

import render from './render'

const zip = new JSZip()

interface Config {
  dryRun: boolean
}

const generate = (tree: JSX.Element, config: Config) => {
  const genAppXml = (
    slides: any[] = [],
    companyName = 'My Corp'
  ) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
    <Application>Microsoft Office PowerPoint</Application>
    <Slides>${slides.length}</Slides>
    <ScaleCrop>false</ScaleCrop>
    <HeadingPairs>
      <vt:vector size="4" baseType="variant">
        <vt:variant>
          <vt:lpstr>Theme</vt:lpstr>
        </vt:variant>
        <vt:variant>
          <vt:i4>1</vt:i4>
        </vt:variant>
        <vt:variant>
          <vt:lpstr>Slide Titles</vt:lpstr>
        </vt:variant>
        <vt:variant>
          <vt:i4>1</vt:i4>
        </vt:variant>
      </vt:vector>
    </HeadingPairs>
    <TitlesOfParts>
      <vt:vector size="1" baseType="lpstr">
        <vt:lpstr>Office Theme</vt:lpstr>
      </vt:vector>
    </TitlesOfParts>
    <Company>${companyName}</Company>
    <LinksUpToDate>false</LinksUpToDate>
    <SharedDoc>false</SharedDoc>
    <HyperlinksChanged>false</HyperlinksChanged>
    <AppVersion>12.0000</AppVersion>
  </Properties>
  `

  const genCoreXml = () => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <dc:creator>mottox2</dc:creator>
    <cp:lastModifiedBy>mottox2</cp:lastModifiedBy>
    <dcterms:created xsi:type="dcterms:W3CDTF">2019-08-07T01:43:14Z</dcterms:created>
    <dcterms:modified xsi:type="dcterms:W3CDTF">2019-08-07T01:43:14Z</dcterms:modified>
    <dc:title>Sample Slide</dc:title>
    <dc:description>Sample Slide</dc:description>
    <dc:subject>mottox2</dc:subject>
    <cp:keywords>office 2007 openxml libreoffice odt php</cp:keywords>
    <cp:category>category Category</cp:category>
  </cp:coreProperties>
  `

  const theme1 = fs.readFileSync('./xml/theme1.xml')
  const slideLayout1 = fs.readFileSync('./xml/slideLayout1.xml')
  const slideMaster1 = fs.readFileSync('./xml/slideMaster1.xml')
  const chart1 = fs.readFileSync('./xml/chart1.xml')

  zip.folder('_rels')
  zip.folder('docProps')
  zip.folder('ppt').folder('_rels')
  zip.folder('ppt/slideLayouts').folder('_rels')
  zip.folder('ppt/slideMasters').folder('_rels')
  zip.folder('ppt/slides').folder('_rels')
  zip.folder('ppt/charts')
  zip.folder('ppt/theme')

  zip.file('docProps/core.xml', genCoreXml())

  zip.file('ppt/theme/theme1.xml', theme1)
  zip.file(
    'ppt/presProps.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <p:presentationPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
    <p:extLst>
      <p:ext uri="{E76CE94A-603C-4142-B9EB-6D1370010A27}">
        <p14:discardImageEditData xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" val="0"/>
      </p:ext>
      <p:ext uri="{D31A062A-798A-4329-ABDD-BBA856620510}">
        <p14:defaultImageDpi xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" val="220"/>
      </p:ext>
    </p:extLst>
  </p:presentationPr>
  `
  )
  zip.file(
    'ppt/tableStyles.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>
  `
  )
  zip.file(
    'ppt/viewProps.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <p:viewPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" showComments="0" lastView="sldView">
    <p:slideViewPr>
      <p:cSldViewPr>
        <p:cViewPr>
          <p:scale>
            <a:sx d="100" n="100"/>
            <a:sy d="100" n="100"/>
          </p:scale>
          <p:origin x="0" y="0"/>
        </p:cViewPr>
      </p:cSldViewPr>
    </p:slideViewPr>
  </p:viewPr>
  `
  )

  zip.file('ppt/slideLayouts/slideLayout1.xml', slideLayout1)
  zip.file(
    'ppt/slideLayouts/_rels/slideLayout1.xml.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
  </Relationships>
  `
  )

  zip.file('ppt/slideMasters/slideMaster1.xml', slideMaster1)
  zip.file(
    'ppt/slideMasters/_rels/slideMaster1.xml.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
  </Relationships>
  `
  )

  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
    <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
  </Relationships>
  `
  )

  const VERSION = Number(new Date())

  const { slides, charts } = render(tree)

  charts.forEach((chart, index) => {
    const chartNum = index + 1
    zip.file(`ppt/charts/chart${chartNum}.xml`, chart.content)
  })

  slides.forEach((slide, index) => {
    const slideNum = index + 1

    zip.file(
      `ppt/slides/slide${slideNum}.xml`,
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' + slide.content
    )

    zip.file(
      `ppt/slides/_rels/slide${slideNum}.xml.rels`,
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${slide.relationships
        .map(relationship => {
          const { rId, id, type } = relationship
          return `<Relationship Id="rId${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/${type}" Target="../${type}s/${type}${id}.xml"/>`
        })
        .join('\n')}
</Relationships>`
    )
  })

  // CHECK: ファイルが増えたら確認すること
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
    <Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/>
    <Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/>
    <Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/>
    <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
    <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
    <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
    <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
    <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
    ${slides
      .map((slide, index) => {
        return `<Override PartName="/ppt/slides/slide${index +
          1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`
      })
      .join('\n')}
    ${charts
      .map((chart, index) => {
        return `<Override PartName="/ppt/charts/chart${index +
          1}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>`
      })
      .join('\n')}
    <Default Extension="gif" ContentType="image/gif"/>
    <Default Extension="jpg" ContentType="image/jpeg"/>
    <Default Extension="jpeg" ContentType="image/jpeg"/>
    <Default Extension="png" ContentType="image/png"/>
    <Default Extension="xlsx" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
  </Types>
  `
  )

  zip.file(
    'ppt/_rels/presentation.xml.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
    ${slides
      .map((slide, index) => {
        return `<Relationship Id="rId${3 +
          index}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${index +
          1}.xml"/>`
      })
      .join('\n')}
    <Relationship Id="rId${slides.length +
    3}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps" Target="presProps.xml"/>
    <Relationship Id="rId${slides.length +
    4}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps" Target="viewProps.xml"/>
    <Relationship Id="rId${slides.length +
    5}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles" Target="tableStyles.xml"/>
  </Relationships>
  `
  )

  zip.file(
    'ppt/presentation.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
      <p:sldMasterIdLst>
        <p:sldMasterId id="2147483648" r:id="rId1"/>
      </p:sldMasterIdLst>
      <p:sldIdLst>
        ${slides
      .map((slide, index) => {
        return `<p:sldId id="${256 + index}" r:id="rId${3 + index}"/>`
      })
      .join('\n')}
      </p:sldIdLst>
      <p:sldSz cx="9144000" cy="6858000" type="screen4x3"/>
      <p:notesSz cx="6858000" cy="9144000"/>
    <p:defaultTextStyle>
      <a:defPPr>
       <a:defRPr lang="fr-FR"/>
      </a:defPPr>
      <a:lvl1pPr algn="l" defTabSz="914400" eaLnBrk="1" hangingPunct="1" latinLnBrk="0" marL="0" rtl="0">
       <a:defRPr kern="1200" sz="1800">
        <a:solidFill>
         <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
       </a:defRPr>
      </a:lvl1pPr>
      <a:lvl2pPr algn="l" defTabSz="914400" eaLnBrk="1" hangingPunct="1" latinLnBrk="0" marL="457200" rtl="0">
       <a:defRPr kern="1200" sz="1800">
        <a:solidFill>
         <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
       </a:defRPr>
      </a:lvl2pPr>
      <a:lvl3pPr algn="l" defTabSz="914400" eaLnBrk="1" hangingPunct="1" latinLnBrk="0" marL="914400" rtl="0">
       <a:defRPr kern="1200" sz="1800">
        <a:solidFill>
         <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
       </a:defRPr>
      </a:lvl3pPr>
      <a:lvl4pPr algn="l" defTabSz="914400" eaLnBrk="1" hangingPunct="1" latinLnBrk="0" marL="1371600" rtl="0">
       <a:defRPr kern="1200" sz="1800">
        <a:solidFill>
         <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
       </a:defRPr>
      </a:lvl4pPr>
      <a:lvl5pPr algn="l" defTabSz="914400" eaLnBrk="1" hangingPunct="1" latinLnBrk="0" marL="1828800" rtl="0">
       <a:defRPr kern="1200" sz="1800">
        <a:solidFill>
         <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
       </a:defRPr>
      </a:lvl5pPr>
      <a:lvl6pPr algn="l" defTabSz="914400" eaLnBrk="1" hangingPunct="1" latinLnBrk="0" marL="2286000" rtl="0">
       <a:defRPr kern="1200" sz="1800">
        <a:solidFill>
         <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
       </a:defRPr>
      </a:lvl6pPr>
      <a:lvl7pPr algn="l" defTabSz="914400" eaLnBrk="1" hangingPunct="1" latinLnBrk="0" marL="2743200" rtl="0">
       <a:defRPr kern="1200" sz="1800">
        <a:solidFill>
         <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
       </a:defRPr>
      </a:lvl7pPr>
      <a:lvl8pPr algn="l" defTabSz="914400" eaLnBrk="1" hangingPunct="1" latinLnBrk="0" marL="3200400" rtl="0">
       <a:defRPr kern="1200" sz="1800">
        <a:solidFill>
         <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
       </a:defRPr>
      </a:lvl8pPr>
      <a:lvl9pPr algn="l" defTabSz="914400" eaLnBrk="1" hangingPunct="1" latinLnBrk="0" marL="3657600" rtl="0">
       <a:defRPr kern="1200" sz="1800">
        <a:solidFill>
         <a:schemeClr val="tx1"/>
        </a:solidFill>
        <a:latin typeface="+mn-lt"/>
        <a:ea typeface="+mn-ea"/>
        <a:cs typeface="+mn-cs"/>
       </a:defRPr>
      </a:lvl9pPr>
     </p:defaultTextStyle>
    </p:presentation>`
  )

  zip.file('docProps/app.xml', genAppXml(slides))

  if (config.dryRun) {
    return
  }
  zip.generateAsync({ type: 'nodebuffer' }).then(function (content: any) {
    fs.writeFile(`results/result-${VERSION}.pptx`, content, function () {
      execSync(`open results/result-${VERSION}.pptx`)
    })
    // fs.writeFile(`results/result-${VERSION}.zip`, content, function() {})
  })
}

export default generate
