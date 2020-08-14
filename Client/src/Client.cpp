#include "include/Client.hpp"
#include "include/nlohmannJson.hpp"
#include <memory>
#include <sstream>
#include <fstream>
#include "include/utilities.hpp"

using json = nlohmann::json;

std::shared_ptr<Client> Client::instance = nullptr;
std::shared_ptr<Client> Client::getInstance()
{
    if (instance == nullptr)
    {
        instance = std::shared_ptr<Client>(new Client());
    }
    return instance;
}

/**
 * @brief Obtiene el ultimo commit que se encuentra en el archivo metadata
 * 
 * @return json Ultimo commit
 */
json Client::getMetaData(){
    std::ifstream ifs("./.metadata.json");
    json metadata;
    ifs >> metadata;
    return metadata["lastCommit"].get<std::string>();
}

/**
 * @brief Sirve para el comando got init, envia la informacion de un nuevo repositorio para que este sea inicializado en el servidor
 * 
 * @param repoName Nombre del nuevo repositorio
 * @return int Estado de la operacion del cliente
 */
int Client::init(std::string& repoName)
{
    json req={{"name", repoName}};
    auto res = cpr::Post(cpr::Url{url + "/init"},jsonHeader,cpr::Body{req.dump()});
    json response = json::parse(res.text);
    if (response["status"].get<std::string>() == "failed")
        return -1;
    else
        return response["id"].get<int>();
}
int Client::commit(std::string message)
{
    //file data preparations 
    json metaData = getMetaData();
    json commitJson = { {"repo_id",metaData["id"].get<int>()},
                        {"message",message},
                        {"previous_commit",metaData["lastCommitId"].get<std::string>()} };
    json addFiles = metaData["add"];
    json newFileList;
    for(auto file_route : addFiles){
        std::ifstream ifs(file_route.get<std::string>());
        std::string content((std::istreambuf_iterator<char>(ifs)),
                            (std::istreambuf_iterator<char>()));
        json file = {{"route", file_route.get<std::string>()},
                    {"contents", content}};
        newFileList.push_back(file);
    }
    json changedFileList;
    json changeFiles= metaData["tracked"];;
    for(auto file_route : changeFiles){
        std::ifstream ifs(file_route.get<std::string>());
        std::string content((std::istreambuf_iterator<char>(ifs)),
                            (std::istreambuf_iterator<char>()));
        json file = {{"route", file_route.get<std::string>()},
                    {"contents", content}};
        changedFileList.push_back(file);
    }
    commitJson["add_files"] = newFileList;
    commitJson["changed_files"] = changedFileList;

    //cpr post 
    auto res = cpr::Post(cpr::Url{url + "/init"},jsonHeader,cpr::Body{commitJson.dump()});
    json response = json::parse(res.text);

    metaData["lastCommitId"]= response["commit_id"].get<std::string>();
    return 0;

}