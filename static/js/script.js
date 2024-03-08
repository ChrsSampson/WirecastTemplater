console.log('script.js loaded')

var xml_doc = null
var error_message = null

const xml_display = document.getElementById('xml')
const form = document.getElementById('settings_form')


function set_error_message(arr){
    const error_container = document.getElementById('error')
    for (e in arr){
        error_message += e + '\n'
    }
    error_container.innerHTML = error_message
}


async function get_xml(){
    try{
        const res = await fetch('/template')
        if (!res.ok) {
            throw new Error(`Status ${res.status} was recieved`)
        }
        const data = await res.text()
        return data
    } catch (err) {
        console.log(err)
    }
}


function string_to_xml(string){
    const parser = new DOMParser()
    return parser.parseFromString(string, 'application/xml')
}


function get_input_values(){
    const fields = document.getElementsByTagName('input')
    const inputs = {}
    for (field in fields){
        // I am lazy - this is good enough
        if (fields[field].type == 'text') {
            inputs[fields[field].name] = fields[field].value
        }
    }
    return inputs
}

function change_xml_fields(input_obj){
   const doc1 = xml_doc.getElementsByTagName('preset')
   console.log(doc1)
}

// write out xml to file
function write_out_file(name='template'){
    const serializer = new XMLSerializer()
    const xml_str = serializer.serializeToString(xml_doc)
    return new File([xml_str], `${name}.wcst`)
}


function start_file_download(file){
    // Create a link and set the URL using `createObjectURL`
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = URL.createObjectURL(file);
    link.download = file.name;

    // It needs to be added to the DOM so it can be clicked
    document.body.appendChild(link);
    link.click();

    // To make this work on Firefox we need to wait
    // a little while before removing it.
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        link.parentNode.removeChild(link);
    }, 0);
}

// Primary channel in template needs to be flagged with "stream_channel='1'"
function set_stream_channel(name, password, address='zixi.streaming-01.digitell.io', port=2088){
    const output_list = xml_doc.querySelector('output_list')

    const outputs = output_list.children

    for (out in outputs){
        const node = outputs[out]

        try{
            const stream_channel = node.getAttribute('stream_channel')

            const stream_address = `${name}?bx=zixi%2Estreaming%2D01%2Edigitell%2Eio&amp;port=2088&amp;pwd=&amp;latency=4000"`

            if (stream_channel){     
                node.setAttribute('dd_username', name)
                node.setAttribute('dd_password', password)
                node.setAttribute('dd_input_broadcaster_add', address)
                node.setAttribute('dd_input_broadcaster_port', port)
                node.setAttribute('output_location', stream_address)
            }
        } catch (err){
            console.warn(err)
            continue
        }
    }

    xml_doc.output_list = output_list
}

function set_record_channel(out_path="D:\\Archive\\"){
    const output_list = xml_doc.querySelector('output_list')

    const outputs = output_list.children

    for (out in outputs){
        const node = outputs[out]

        try{
            const record_channel = node.getAttribute('record_channel')

            if (record_channel){     
                node.setAttribute('output_url', String(out_path))

            }

        } catch (err){
            console.warn(err)
            continue
        }

    }
    xml_doc.output_list = output_list
}


form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const inputs = get_input_values()

    // for(i in inputs){
    //     const errs = []
    //     if (inputs[i] == ''){
    //         errs.push('input ' + i + ' is empty')
    //     }
    //     if( errs.length > 0 ) {
    //         set_error_message(errs)
    //         console.log(errs)
    //         return
    //     }
    // }

    const raw_xml_str = await get_xml()

    xml_doc = string_to_xml(raw_xml_str)

    set_stream_channel(String(inputs.channel_name), String(inputs.channel_password))
    set_record_channel(String(inputs['output_path']))

    const out_file = write_out_file(inputs['file_name'])
    
    start_file_download(out_file, inputs['file_name'])
})