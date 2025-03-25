const filterOption = (data=[],searchText="") =>{
    return data.filter(item=>Object.values(item).some(value=>String(value).toLowerCase().includes(searchText.toLowerCase())))
}
export default filterOption;

