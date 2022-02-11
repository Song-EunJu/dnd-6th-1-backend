import { EntityRepository, Repository } from "typeorm";
import { Histories } from "../entity/histories.entity";

@EntityRepository(Histories) 
export class HistoriesRepository extends Repository<Histories>{
    
    // 특정 검색기록 번호 있는지
    async findByHistoryId(historyId: number){
        return await this.findOne({historyId, historyStatus: true},
            {relations: ['userId']}
        );
    }

    // 특정 키워드로 검색한 기록이 있는지
    async findByKeyword(keyword: string){
        return await this.findOne({keyword, historyStatus: true});
    }

    // 검색어 전체 조회 
    async getAllHistories(userId: number) {
        return await this.find({       
            where: {
                userId,
                historyStatus: true
            }, 
            order: {
                keywordSearched : 'DESC' // 시간 내림차순 (최신순) 정렬
            },
            take:5 // 최근 검색어 5개까지만
        });
    }

    //  검색어 입력 시
    async createHistory(userId: number, keyword: string): Promise<Histories>{
        const history = {
            keyword,
            userId,
            keywordSearched: new Date()
        }
        const newHistory = await this.save(history);
        return newHistory;
    }

    // 특정 기록만 지우기
    async deleteHistory(userId: number, historyId: number){
        await this.update({userId, historyId},{historyStatus: false});
    }

    // 검색어 전체기록 지우기
    async deleteAllHistories(userId: number){
        await this.update({userId},{historyStatus: false});
    } 
}