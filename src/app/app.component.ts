import {ChangeDetectorRef, Component, Input, NgModule, OnInit, } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{

  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private http: HttpClient) { }

  title = 'premier-league-manager';
  MatchTableColumns: string[] = ['teamOne', 'teamTwo', 'matchDate', 'team1ScoredGoals', 'team2ScoredGoals', 'team1ReceivedGoals', 'team2ReceivedGoals'];
  ClubTableColumns: string[] = ['clubName', 'clubAddress1', 'clubCity', 'clubZipCode', 'clubCountry', 'clubWins', 'clubDefeats', 'clubDraws',
    'clubGoalsScored', 'clubGoalsReceived', 'clubPoints', 'clubMatches'];
  searchedTableColumns: string[] = ['teamOne', 'teamTwo', 'matchDate', 'team1ScoredGoals', 'team2ScoredGoals', 'team1ReceivedGoals', 'team2ReceivedGoals'];

  matchDataSource: MatTableDataSource<Match> = new MatTableDataSource<Match>();
  clubDataSource: MatTableDataSource<Club> = new MatTableDataSource<Club>();
  matchData: Match[] = [];
  clubData: Club[] = [];
  dateValue = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.http.get<Club[]>('http://localhost:8080/clubData').subscribe(data => {
      this.clubData = data;
      this.clubDataSource.data = this.clubData;
    });
    this.http.get<Match[]>('http://localhost:8080/matchData').subscribe(data => {
      this.matchData = data;
      for (const match of this.matchData) {
        match.matchDate.date = this.convertDate(match.matchDate.date);
      }
      this.matchDataSource.data = this.matchData;
    });
  }

  sortClubByGoals(): void {
    this.clubData.sort((a, b) => (a.clubGoalsScored < b.clubGoalsScored) ? 1 : -1);
    this.clubDataSource.data = this.clubData;
  }

  sortClubByWins(): void{
    this.clubData.sort((a, b) => (a.clubWins < b.clubWins) ? 1 : -1);
    this.clubDataSource.data = this.clubData;
  }

  sortClubByPoints(): void{
    this.clubData.sort((a, b) => (a.clubPoints < b.clubPoints) ? 1 : -1);
    this.clubDataSource.data = this.clubData;
  }

  sortMatchByDate(): void{
    this.matchData.sort((a, b) => (a.matchDate.date < b.matchDate.date) ? 1 : -1);
    this.matchDataSource.data = this.matchData;
  }

  convertDate(text: string): string{
    const splittedDate: string[] = text.split('/');
    const dateText = splittedDate[2] + '/' + splittedDate[1] + '/' + splittedDate[0];
    return dateText;
  }

  generateRandomMatch() {
    this.http.get<Match>('http://localhost:8080/randomMatch').subscribe(data => {
      this.loadData();
    });
  }

  onEnter(value: string) {
    this.dateValue = value;
  }

  searchByDate() {
    const result = this.matchData.find(match => match.matchDate.date === this.dateValue);
    const matchArray = [];
    if (result) {
      matchArray.push(result);
    }
    this.matchDataSource.data = matchArray;
  }

  back() {
    this.matchDataSource.data = this.matchData;
  }
}


export interface Match {
  teamOne: string;
  teamTwo: string;
  matchDate: Date;
  team1GoalsReceived: number;
  team2GoalsReceived: number;
  team1GoalsScored: number;
  team2GoalsScored: number;
  manual: boolean;
}

export interface Date {
  date: string;
}

export interface Club{

  clubName: string;
  clubAddress1: string;
  clubCity: string;
  clubZipCode: string;
  clubCountry: string;
  clubWins: number;
  clubDefeats: number;
  clubDraws: number;
  clubGoalsScored: number;
  clubGoalsReceived: number;
  clubPoints: number;
  clubMatches: number;

}


